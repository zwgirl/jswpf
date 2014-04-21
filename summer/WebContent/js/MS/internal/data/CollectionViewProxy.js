/**
 * CollectionViewProxy
 */

define(["dojo/_base/declare", "system/Type", "data/CollectionView", "componentmodel/IEditableCollectionViewAddNewItem",
        "componentmodel/ICollectionViewLiveShaping", "componentmodel/IItemProperties", "componentmodel/IEditableCollectionView",
        "componentmodel/INotifyPropertyChanged", "specialized/NotifyCollectionChangedEventHandler","system/EventHandler", 
        "system/Delegate", "componentmodel/PropertyChangedEventHandler", "componentmodel/CurrentChangingEventHandler"
        ], 
		function(declare, Type, CollectionView, IEditableCollectionViewAddNewItem,
				ICollectionViewLiveShaping, IItemProperties, IEditableCollectionView,
				Delegate, PropertyChangedEventHandler, CurrentChangingEventHandler
				){
	var CollectionViewProxy = declare("CollectionViewProxy", 
			[CollectionView, IEditableCollectionViewAddNewItem, ICollectionViewLiveShaping, IItemProperties],{
		constructor:function(/*ICollectionView*/ view)
        { 
			CollectionView.prototype.constructor.call(this, view.SourceCollection, false);
            this._view = view;
 
            view.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this._OnViewChanged)); 

            view.CurrentChanging.Combine(new CurrentChangingEventHandler(this, this._OnCurrentChanging)); 
            view.CurrentChanged.Combine(new EventHandler(this, this._OnCurrentChanged));

            /*INotifyPropertyChanged*/var ipc = view instanceof INotifyPropertyChanged ? view : null;
            if (ipc != null) 
                ipc.PropertyChanged.Combine(new PropertyChangedEventHandler(this, _OnPropertyChanged));
        },
        
        /// <summary>
        /// Return true if the item belongs to this view.  No assumptions are 
        /// made about the item. This method will behave similarly to IList.Contains().
        /// If the caller knows that the item belongs to the
        /// underlying collection, it is more efficient to call PassesFilter.
        /// </summary> 
//        public override bool 
        Contains:function(/*object*/ item)
        { 
            return this.ProxiedView.Contains(item); 
        },
        
      /// Re-create the view, using any <seealso cref="SortDescriptions"/>.
//        public override void 
        Refresh:function()
        {
            /*IndexedEnumerable*/var  indexer = Interlocked.Exchange(/*ref*/ this._indexer, null); 
            if (indexer != null)
            { 
                indexer.Invalidate(); 
            }
 
            this.ProxiedView.Refresh();
        },

        /// <summary> 
        /// Enter a Defer Cycle.
        /// Defer cycles are used to coalesce changes to the ICollectionView. 
        /// </summary> 
//        public override IDisposable 
        DeferRefresh:function()
        { 
            return this.ProxiedView.DeferRefresh();
        },


        /// <summary> Move to the first item. </summary> 
//        public override bool 
        MoveCurrentToFirst:function()
        { 
            return this.ProxiedView.MoveCurrentToFirst(); 
        },
 
        /// <summary> Move to the previous item. </summary>
//        public override bool 
        MoveCurrentToPrevious:function()
        {
            return this.ProxiedView.MoveCurrentToPrevious(); 
        },
 
        /// <summary> Move to the next item. </summary> 
//        public override bool 
        MoveCurrentToNext:function()
        { 
            return this.ProxiedView.MoveCurrentToNext();
        },

        /// <summary> Move to the last item. </summary> 
//        public override bool 
        MoveCurrentToLast:function()
        { 
            return this.ProxiedView.MoveCurrentToLast(); 
        },
 
        /// <summary> Move to the given item. </summary>
//        public override bool 
        MoveCurrentTo:function(/*object*/ item)
        {
            return this.ProxiedView.MoveCurrentTo(item); 
        },
 
        /// <summary>Move CurrentItem to this index</summary> 
//        public override bool 
        MoveCurrentToPosition:function(/*int*/ position)
        { 
            //
            // If the index is out of range here, I'll let the
            // ProxiedView be the one to make that determination.
            // 
            return this.ProxiedView.MoveCurrentToPosition(position);
        } ,
 
//        public override event CurrentChangingEventHandler CurrentChanging
//        { 
//            AddCurrentChangingHandler:function(value)     { PrivateCurrentChanging += value; },
//            RemoveCurrentChangingHandler:function(value)  { PrivateCurrentChanging -= value; },
//        },
        
        AddCurrentChangingHandler:function(value)     { Pthis.rivateCurrentChanging += value; },
        RemoveCurrentChangingHandler:function(value)  { this.PrivateCurrentChanging -= value; },
 
//        public override event EventHandler CurrentChanged
//        { 
//            AddCurrentChangedHandler:function(value)     { PrivateCurrentChanged += value; }, 
//            RemoveCurrentChangedHandler:function(value)  { PrivateCurrentChanged -= value; },
//        }, 
        
        AddCurrentChangedHandler:function(value)     { this.PrivateCurrentChanged += value; }, 
        RemoveCurrentChangedHandler:function(value)  { this.PrivateCurrentChanged -= value; },
   
 
        /// <summary> Return the index where the given de belongs, or -1 if this index is unknown.
        /// More precisely, if this returns an index other than -1, it must always be true that 
        /// view[index-1] &lt; de &lt;= view[index], where the comparisons are done via 
        /// the view's IComparer.Compare method (if any).
        /// </summary> 
        /// <param name="item">data item</param>
//        public override int 
        IndexOf:function(/*object*/ item)
        {
            return EnumerableWrapper.IndexOf(item); 
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
            if (this.ProxiedView.CanFilter && this.ProxiedView.Filter != null && 
                    item != this.NewItemPlaceholder && item != this.CurrentAddItem)
                return this.ProxiedView.Filter(item); 

            return true;
        },
 
        /// <summary>
        /// Retrieve item at the given zero-based index in this CollectionView. 
        /// </summary> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// Thrown if index is out of range 
        /// </exception>
//        public override object 
        GetItemAt:function(/*int*/ index)
        {
            // only check lower bound because Count could be expensive 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index"); 
            return EnumerableWrapper.Get(index); 
        },
 
        /// <summary>
        /// Detach from the source collection.  (I.e. stop listening to the collection's
        /// events, or anything else that makes the CollectionView ineligible for
        /// garbage collection.) 
        /// </summary>
//        public override void 
        DetachFromSourceCollection:function() 
        { 
            if (this._view != null)
            { 
            	this._view.CollectionChanged -= new NotifyCollectionChangedEventHandler(this._OnViewChanged);

            	this._view.CurrentChanging -= new CurrentChangingEventHandler(this._OnCurrentChanging);
            	this._view.CurrentChanged -= new EventHandler(this._OnCurrentChanged); 

                /*INotifyPropertyChanged*/var ipc = this._view instanceof INotifyPropertyChanged ? this._view : null; 
                if (ipc != null) 
                    ipc.PropertyChanged -= new PropertyChangedEventHandler(this._OnPropertyChanged);
 
                this._view = null;
            }

            base.DetachFromSourceCollection(); 
        },

  
 
        /// <summary>
        /// Add a new item to the underlying collection.  Returns the new item.
        /// After calling AddNew and changing the new item as desired, either
        /// <seealso cref="IEditableCollectionView.CommitNew"/> or <seealso cref="IEditableCollectionView.CancelNew"/> should be 
        /// called to complete the transaction.
        /// </summary> 
//        object  IEditableCollectionView.
        AddNew:function() 
        {
            var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
            if (ecv != null)
            {
                return ecv.AddNew();
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNew")); 
            }
        }, 


        /// <summary>
        /// Complete the transaction started by <seealso cref="IEditableCollectionView.AddNew"/>.  The new 
        /// item remains in the collection, and the view's sort, filter, and grouping
        /// specifications (if any) are applied to the new item. 
        /// </summary> 
//        void    IEditableCollectionView.
        CommitNew:function()
        { 
            var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null)
            {
                ecv.CommitNew(); 
            }
            else 
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "CommitNew"));
            } 
        },

        /// <summary>
        /// Complete the transaction started by <seealso cref="IEditableCollectionView.AddNew"/>.  The new 
        /// item is removed from the collection.
        /// </summary> 
//        void    IEditableCollectionView.
        CancelNew:function() 
        {
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null)
            {
                ecv.CancelNew();
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "CancelNew")); 
            }
        }, 


        /// <summary>
        /// Remove the item at the given index from the underlying collection.
        /// The index is interpreted with respect to the view (not with respect to 
        /// the underlying collection).
        /// </summary> 
//        void    IEditableCollectionView.
        RemoveAt:function(/*int*/ index) 
        {
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null)
            {
                ecv.RemoveAt(index);
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "RemoveAt")); 
            }
        }, 

        /// <summary>
        /// Remove the given item from the underlying collection.
        /// </summary> 
//        void    IEditableCollectionView.
        Remove:function(/*object*/ item)
        { 
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
            if (ecv != null)
            { 
                ecv.Remove(item);
            }
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "Remove"));
            } 
        }, 

        /// <summary> 
        /// Begins an editing transaction on the given item.  The transaction is
        /// completed by calling either <seealso cref="IEditableCollectionView.CommitEdit"/> or 
        /// <seealso cref="IEditableCollectionView.CancelEdit"/>.  Any changes made to the item during 
        /// the transaction are considered "pending", provided that the view supports
        /// the notion of "pending changes" for the given item. 
        /// </summary>
//        void    IEditableCollectionView.
        EditItem:function(/*object*/ item)
        {
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null)
            { 
                ecv.EditItem(item); 
            }
            else 
            {
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "EditItem"));
            }
        }, 

        /// <summary> 
        /// Complete the transaction started by <seealso cref="IEditableCollectionView.EditItem"/>. 
        /// The pending changes (if any) to the item are committed.
        /// </summary> 
//        void    IEditableCollectionView.
        CommitEdit:function()
        {
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null) 
            {
                ecv.CommitEdit(); 
            } 
            else
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "CommitEdit"));
            }
        },
 
        /// <summary>
        /// Complete the transaction started by <seealso cref="IEditableCollectionView.EditItem"/>. 
        /// The pending changes (if any) to the item are discarded. 
        /// </summary>
//        void    IEditableCollectionView.
        CancelEdit:function() 
        {
            /*IEditableCollectionView*/
        	var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
            if (ecv != null)
            { 
                ecv.CancelEdit();
            } 
            else 
            {
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "CancelEdit")); 
            }
        },

 
        /// <summary>
        /// Add a new item to the underlying collection.  Returns the new item.
        /// After calling AddNewItem and changing the new item as desired, either 
        /// <seealso cref="IEditableCollectionView.CommitNew"/> or <seealso cref="IEditableCollectionView.CancelNew"/> should be
        /// called to complete the transaction. 
        /// </summary> 
//        object  IEditableCollectionViewAddNewItem.
        AddNewItem:function(/*object*/ newItem)
        { 
            /*IEditableCollectionViewAddNewItem*/
        	var ani = this.ProxiedView instanceof IEditableCollectionViewAddNewItem ? this.ProxiedView : null;
            if (ani != null)
            {
                return ani.AddNewItem(newItem); 
            }
            else 
            { 
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNewItem"));
            } 
        },
   

        /// <summary> Implementation of IEnumerable.GetEnumerator().
        /// This provides a way to enumerate the members of the collection 
        /// without changing the currency.
        /// </summary> 
//        protected override IEnumerator 
        GetEnumerator:function() { return (this.ProxiedView).GetEnumerator(); }, 

//        internal override void 
        GetCollectionChangedSources:function(/*int*/ level, /*Action<int, object, bool?, List<string>>*/ format, /*List<string>*/ sources)
        { 
            format(level, this, false, sources); 
            if (_view != null)
            { 
                format(level+1, _view, true, sources);

                var collection = _view.SourceCollection;
                if (collection != null) 
                {
                    format(level+2, collection, null, sources); 
                } 
            }
        }, 

//        void 
        _OnPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ args)
        { 
        	this.OnPropertyChanged(args);
        }, 
 
//        void 
        _OnViewChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ args)
        { 
//             VerifyAccess();    // will throw an exception if caller is not in correct UiContext

        	this.OnCollectionChanged(args);
        },

//        void 
        _OnCurrentChanging:function(/*object*/ sender, /*CurrentChangingEventArgs*/ args) 
        { 
//             VerifyAccess();    // will throw an exception if caller is not in correct UiContext
 
            if (this.PrivateCurrentChanging != null)
            	this.PrivateCurrentChanging(this, args);
        },
 
//        void 
        _OnCurrentChanged:function(/*object*/ sender, /*EventArgs*/ args)
        { 
//             VerifyAccess();    // will throw an exception if caller is not in correct UiContext 

            if (this.PrivateCurrentChanged != null) 
            	this.PrivateCurrentChanged(this, args);
        }
 
        
	});
	
	Object.defineProperties(CollectionViewProxy.prototype,{
        /// <summary>
        /// Culture to use during sorting. 
        /// </summary>
//        public override System.Globalization.CultureInfo 
		Culture:
        {
            get:function() { return this.ProxiedView.Culture; }, 
            set:function(value) { this.ProxiedView.Culture = value; }
        },
        
        /// <summary>
        /// SourceCollection is the original un-filtered collection of which
        /// this ICollectionView is a view.
        /// </summary> 
//        public override IEnumerable 
        SourceCollection:
        { 
            get:function() { return CollectionView.prototype.SourceCollection; } 
        },
 
        /// <summary>
        /// Set/get a filter callback to filter out items in collection.
        /// This property will always accept a filter, but the collection view for the
        /// underlying InnerList or ItemsSource may not actually support filtering. 
        /// Please check <seealso cref="CanFilter"/>
        /// </summary> 
        /// <exception cref="NotSupportedException"> 
        /// Collections assigned to ItemsSource may not support filtering and could throw a NotSupportedException.
        /// Use <seealso cref="CanSort"/> property to test if sorting is supported before adding 
        /// to SortDescriptions.
        /// </exception>
//        public override Predicate<object> 
        Filter:
        { 
            get:function() { return this.ProxiedView.Filter; },
            set:function(value) { this.ProxiedView.Filter = value; } 
        }, 

        /// <summary> 
        /// Test if this ICollectionView supports filtering before assigning
        /// a filter callback to <seealso cref="Filter"/>.
        /// </summary>
//        public override bool 
        CanFilter: 
        {
            get:function() { return this.ProxiedView.CanFilter; } 
        }, 

        /// <summary> 
        /// Set/get Sort criteria to sort items in collection.
        /// </summary>
        /// <remarks>
        /// <p> 
        /// Clear a sort criteria by assigning SortDescription.Empty to this property.
        /// One or more sort criteria in form of <seealso cref="SortDescription"/> 
        /// can be used, each specifying a property and direction to sort by. 
        /// </p>
        /// </remarks> 
        /// <exception cref="NotSupportedException">
        /// Simpler implementations do not support sorting and will throw a NotSupportedException.
        /// Use <seealso cref="CanSort"/> property to test if sorting is supported before adding
        /// to SortDescriptions. 
        /// </exception>
//        public override SortDescriptionCollection 
        SortDescriptions: 
        { 
            get:function() { return this.ProxiedView.SortDescriptions; }
        }, 

        /// <summary>
        /// Test if this ICollectionView supports sorting before adding
        /// to <seealso cref="SortDescriptions"/>. 
        /// </summary>
//        public override bool 
        CanSort: 
        { 
            get:function() { return this.ProxiedView.CanSort; }
        }, 

        /// <summary>
        /// Returns true if this view really supports grouping.
        /// When this returns false, the rest of the interface is ignored. 
        /// </summary>
//        public override bool 
        CanGroup: 
        { 
            get:function() { return this.ProxiedView.CanGroup; }
        }, 

        /// <summary>
        /// The description of grouping, indexed by level.
        /// </summary> 
//        public override ObservableCollection<GroupDescription> 
        GroupDescriptions:
        { 
            get:function() { return this.ProxiedView.GroupDescriptions; } 
        },
 
        /// <summary>
        /// The top-level groups, constructed according to the descriptions
        /// given in GroupDescriptions.
        /// </summary> 
//        public override ReadOnlyObservableCollection<object> 
        Groups:
        { 
            get:function() { return this.ProxiedView.Groups; } 
        },
        

        /// <summary> Return current item. </summary> 
//        public override object 
        CurrentItem:
        { 
             get:function() { return this.ProxiedView.CurrentItem; } 
        },
 
        /// <summary>
        /// The ordinal position of the <seealso cref="CurrentItem"/> within the (optionally
        /// sorted and filtered) view.
        /// </summary> 
//        public override int 
        CurrentPosition:
        { 
            get:function() { return this.ProxiedView.CurrentPosition; } 
        },
 
        /// <summary> Return true if currency is beyond the end (End-Of-File). </summary>
//        public override bool 
        IsCurrentAfterLast:
        {
            get:function() { return this.ProxiedView.IsCurrentAfterLast; } 
        },
 
        /// <summary> Return true if currency is before the beginning (Beginning-Of-File). </summary> 
//        public override bool 
        IsCurrentBeforeFirst:
        { 
            get:function() { return this.ProxiedView.IsCurrentBeforeFirst; }
        },
        
        /// <summary>
        /// Return the number of records (or -1, meaning "don't know"). 
        /// A virtualizing view should return the best estimate it can
        /// without de-virtualizing all the data.  A non-virtualizing view 
        /// should return the exact count of its (filtered) data. 
        /// </summary>
//        public override int 
        Count: 
        {
            get:function() { return EnumerableWrapper.Count; }
        },
 
//        public override bool 
        IsEmpty:
        { 
            get:function() { return ProxiedView.IsEmpty; } 
        },
 

//        public ICollectionView 
        ProxiedView:
        {
            get:function() 
            {
//                 VerifyAccess(); 
                return this._view; 
            }
        },
        
        /// <summary> 
        /// Indicates whether to include a placeholder for a new item, and if so,
        /// where to put it. 
        /// </summary> 
//        NewItemPlaceholderPosition IEditableCollectionView.
        NewItemPlaceholderPosition:
        { 
            get:function()
            {
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
                if (ecv != null) 
                {
                    return ecv.NewItemPlaceholderPosition; 
                } 
                else
                { 
                    return NewItemPlaceholderPosition.None;
                }
            },
            set:function(value) 
            {
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
                if (ecv != null) 
                {
                    ecv.NewItemPlaceholderPosition = value; 
                }
                else
                {
                    throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "NewItemPlaceholderPosition")); 
                }
            } 
        }, 

        /// <summary> 
        /// Return true if the view supports <seealso cref="IEditableCollectionView.AddNew"/>.
        /// </summary>
//        bool    IEditableCollectionView.
        CanAddNew:
        { 
            get:function()
            { 
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
                if (ecv != null)
                { 
                    return ecv.CanAddNew;
                }
                else
                { 
                    return false;
                } 
            } 
        },
        

        /// <summary>
        /// Returns true if an </seealso cref="IEditableCollectionView.AddNew"> transaction is in progress.
        /// </summary> 
//        bool    IEditableCollectionView.
        IsAddingNew:
        { 
            get:function() 
            {
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
                if (ecv != null)
                {
                    return ecv.IsAddingNew;
                } 
                else
                { 
                    return false; 
                }
            } 
        },

        /// <summary>
        /// When an </seealso cref="IEditableCollectionView.AddNew"> transaction is in progress, this property 
        /// returns the new item.  Otherwise it returns null.
        /// </summary> 
//        object  IEditableCollectionView.
        CurrentAddItem: 
        {
            get:function() 
            {
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
                if (ecv != null)
                { 
                    return ecv.CurrentAddItem;
                } 
                else 
                {
                    return null; 
                }
            }
        },

        /// <summary> 
        /// Return true if the view supports <seealso cref="IEditableCollectionView.Remove"/> and
        /// <seealso cref="IEditableCollectionView.RemoveAt"/>.
        /// </summary>
//        bool    IEditableCollectionView.
        CanRemove: 
        {
            get:function() 
            { 
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
                if (ecv != null) 
                {
                    return ecv.CanRemove;
                }
                else 
                {
                    return false; 
                } 
            }
        },
        
        /// <summary> 
        /// Returns true if the view supports the notion of "pending changes" on the
        /// current edit item.  This may vary, depending on the view and the particular 
        /// item.  For example, a view might return true if the current edit item 
        /// implements <seealso cref="IEditableObject"/>, or if the view has special
        /// knowledge about the item that it can use to support rollback of pending 
        /// changes.
        /// </summary>
//        bool    IEditableCollectionView.
        CanCancelEdit:
        { 
            get:function()
            { 
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null; 
                if (ecv != null)
                { 
                    return ecv.CanCancelEdit;
                }
                else
                { 
                    return false;
                } 
            } 
        },
 
        /// <summary>
        /// Returns true if an </seealso cref="IEditableCollectionView.EditItem"> transaction is in progress.
        /// </summary>
//        bool    IEditableCollectionView.
        IsEditingItem: 
        {
            get:function() 
            { 
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
                if (ecv != null) 
                {
                    return ecv.IsEditingItem;
                }
                else 
                {
                    return false; 
                } 
            }
        }, 

        /// <summary>
        /// When an </seealso cref="IEditableCollectionView.EditItem"> transaction is in progress, this property
        /// returns the affected item.  Otherwise it returns null. 
        /// </summary>
//        object  IEditableCollectionView.
        CurrentEditItem: 
        { 
            get:function()
            { 
                var ecv = this.ProxiedView instanceof IEditableCollectionView ? this.ProxiedView : null;
                if (ecv != null)
                {
                    return ecv.CurrentEditItem; 
                }
                else 
                { 
                    return null;
                } 
            }
        },
 
        /// <summary>
        /// Return true if the view supports <seealso cref="IEditableCollectionViewAddNewItem.AddNewItem"/>.
        /// </summary>
//        bool    IEditableCollectionViewAddNewItem.
        CanAddNewItem: 
        {
            get:function() 
            { 
                /*IEditableCollectionViewAddNewItem*/var ani = this.ProxiedView instanceof IEditableCollectionViewAddNewItem ? this.ProxiedView : null;
                if (ani != null) 
                {
                    return ani.CanAddNewItem;
                }
                else 
                {
                    return false; 
                } 
            }
        },

        ///<summary> 
        /// Gets a value that indicates whether this view supports turning live sorting on or off.
        ///</summary> 
//        bool ICollectionViewLiveShaping.
        CanChangeLiveSorting:
        {
            get:function()
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                return (cvls != null) ? cvls.CanChangeLiveSorting : false; 
            } 
        },
 
        ///<summary>
        /// Gets a value that indicates whether this view supports turning live filtering on or off.
        ///</summary>
//        bool ICollectionViewLiveShaping.
        CanChangeLiveFiltering: 
        {
            get:function() 
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                return (cvls != null) ? cvls.CanChangeLiveFiltering : false; 
            }
        },

        ///<summary> 
        /// Gets a value that indicates whether this view supports turning live grouping on or off.
        ///</summary> 
//        bool ICollectionViewLiveShaping.
        CanChangeLiveGrouping: 
        {
            get:function() 
            {
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                return (cvls != null) ? cvls.CanChangeLiveGrouping : false;
            } 
        },
 
 
        ///<summary>
        /// Gets or sets a value that indicates whether live sorting is enabled. 
        /// The value may be null if the view does not know whether live sorting is enabled.
        /// Calling the setter when CanChangeLiveSorting is false will throw an
        /// InvalidOperationException.
        ///</summary 
//        bool? ICollectionViewLiveShaping.
        IsLiveSorting:
        { 
            get:function() 
            {
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null; 
                return (cvls != null) ? cvls.IsLiveSorting : null;
            },
            set:function(value)
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                if (cvls != null) 
                    cvls.IsLiveSorting = value; 
                else
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeLiveShaping, "IsLiveSorting", "CanChangeLiveSorting")); 
            }
        },

        ///<summary> 
        /// Gets or sets a value that indicates whether live filtering is enabled.
        /// The value may be null if the view does not know whether live filtering is enabled. 
        /// Calling the setter when CanChangeLiveFiltering is false will throw an 
        /// InvalidOperationException.
        ///</summary> 
//        bool? ICollectionViewLiveShaping.
        IsLiveFiltering:
        {
            get:function()
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                return (cvls != null) ? cvls.IsLiveFiltering : null; 
            }, 
            set:function(value)
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                if (cvls != null)
                    cvls.IsLiveFiltering = value;
                else 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeLiveShaping, "IsLiveFiltering", "CanChangeLiveFiltering"));
            } 
        }, 

        ///<summary> 
        /// Gets or sets a value that indicates whether live grouping is enabled.
        /// The value may be null if the view does not know whether live grouping is enabled.
        /// Calling the setter when CanChangeLiveGrouping is false will throw an
        /// InvalidOperationException. 
        ///</summary>
//        bool? ICollectionViewLiveShaping.
        IsLiveGrouping: 
        { 
            get:function()
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null;
                return (cvls != null) ? cvls.IsLiveGrouping : null;
            },
            set:function(value) 
            {
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null; 
                if (cvls != null) 
                    cvls.IsLiveGrouping = value;
                else 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeLiveShaping, "IsLiveGrouping", "CanChangeLiveGrouping"));
            }
        },
 

        ///<summary> 
        /// Gets a collection of strings describing the properties that 
        /// trigger a live-sorting recalculation.
        /// The strings use the same format as SortDescription.PropertyName. 
        ///</summary>
        ///<notes>
        /// When this collection is empty, the view will use the PropertyName strings
        /// from its SortDescriptions. 
        ///
        /// This collection is useful when sorting is described code supplied 
        /// by the application  (e.g. ListCollectionView.CustomSort). 
        /// In this case the view does not know which properties the code examines;
        /// the application should tell the view by adding the relevant properties 
        /// to the LiveSortingProperties collection.
        ///</notes>
//        ObservableCollection<string> ICollectionViewLiveShaping.
        LiveSortingProperties:
        { 
            get:function()
            { 
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null; 
                if (cvls != null)
                    return cvls.LiveSortingProperties; 

                // use a dummy collection.  Its elements are ignored, but at least it won't crash.
                if (this._liveSortingProperties == null)
                	this._liveSortingProperties = new ObservableCollection/*<string>*/(); 
                return this._liveSortingProperties;
            } 
        }, 

        ///<summary> 
        /// Gets a collection of strings describing the properties that
        /// trigger a live-filtering recalculation.
        /// The strings use the same format as SortDescription.PropertyName.
        ///</summary> 
        ///<notes>
        /// Filtering is described by a Predicate.  The view does not 
        /// know which properties the Predicate examines;  the application should 
        /// tell the view by adding the relevant properties to the LiveFilteringProperties
        /// collection. 
        ///</notes>
//        ObservableCollection<string> ICollectionViewLiveShaping.
        LiveFilteringProperties:
        {
            get:function() 
            {
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null; 
                if (cvls != null) 
                    return cvls.LiveFilteringProperties;
 
                // use a dummy collection.  Its elements are ignored, but at least it won't crash.
                if (this._liveFilteringProperties == null)
                	this._liveFilteringProperties = new ObservableCollection/*<string>*/();
                return this._liveFilteringProperties; 
            }
        }, 
 
        ///<summary>
        /// Gets a collection of strings describing the properties that 
        /// trigger a live-grouping recalculation.
        /// The strings use the same format as PropertyGroupDescription.PropertyName.
        ///</summary>
        ///<notes> 
        /// When this collection is empty, the view will use the PropertyName strings
        /// from its GroupDescriptions. 
        /// 
        /// This collection is useful when grouping is described code supplied
        /// by the application (e.g. PropertyGroupDescription.Converter). 
        /// In this case the view does not know which properties the code examines;
        /// the application should tell the view by adding the relevant properties
        /// to the LiveGroupingProperties collection.
        ///</notes> 
//        ObservableCollection<string> ICollectionViewLiveShaping.
        LiveGroupingProperties:
        { 
            get:function() 
            {
                /*ICollectionViewLiveShaping*/ cvls = this.ProxiedView instanceof ICollectionViewLiveShaping ? this.ProxiedView : null; 
                if (cvls != null)
                    return cvls.LiveGroupingProperties;

                // use a dummy collection.  Its elements are ignored, but at least it won't crash. 
                if (this._liveGroupingProperties == null)
                	this._liveGroupingProperties = new ObservableCollection/*<string>*/(); 
                return _liveGroupingProperties; 
            }
        }, 

        /// <summary> 
        /// Returns information about the properties available on items in the 
        /// underlying collection.  This information may come from a schema, from
        /// a type descriptor, from a representative item, or from some other source 
        /// known to the view.
        /// </summary>
//        ReadOnlyCollection<ItemPropertyInfo>    IItemProperties.
        ItemProperties:
        { 
            get:function()
            { 
                /*IItemProperties*/var iip = this.ProxiedView instanceof IItemProperties ? this.ProxiedView : null; 
                if (iip != null)
                { 
                    return iip.ItemProperties;
                }
                else
                { 
                    return null;
                } 
            } 
        },
        
//        private IndexedEnumerable 
        EnumerableWrapper: 
        {
            get:function() 
            { 
                if (this._indexer == null)
                { 
                    var newIndexer = new IndexedEnumerable(this.ProxiedView, new Predicate/*<object>*/(this.PassesFilter));
                    Interlocked.CompareExchange(/*ref*/ this._indexer, newIndexer, null);
                }
 
                return _indexer;
            } 
        },
        
//      event CurrentChangingEventHandler    
        PrivateCurrentChanging: 
        {
            get:function() 
            { 
                if (this._PrivateCurrentChanging === undefined)
                { 
                	this._PrivateCurrentChanging = new Delegate();
                }
 
                return this._PrivateCurrentChanging;
            } 
        },
//      event EventHandler          
        PrivateCurrentChanged: 
        {
            get:function() 
            { 
                if (this._PrivateCurrentChanged === undefined)
                { 
                	this._PrivateCurrentChanged = new Delegate();
                }
 
                return this._PrivateCurrentChanged;
            } 
        } 
 
	});
	
	Object.defineProperties(CollectionViewProxy,{
		  
	});
	
	CollectionViewProxy.Type = new Type("CollectionViewProxy", CollectionViewProxy, 
			[CollectionView.Type, IEditableCollectionViewAddNewItem.Type, ICollectionViewLiveShaping.Type, IItemProperties.Type]);
	return CollectionViewProxy;
});


 
 
   
        


 
//        ICollectionView     _view;
// 
//        IndexedEnumerable _indexer;
//

//
//        ObservableCollection<string> _liveSortingProperties;    // dummy collection 
//        ObservableCollection<string> _liveFilteringProperties;  // dummy collection 
//        ObservableCollection<string> _liveGroupingProperties;   // dummy collection



