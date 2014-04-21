/**
 * Second check 12-07
 * ItemCollection
 */

define(["dojo/_base/declare", "system/Type", "system/IDisposable", "data/CollectionView", 
        "componentmodel/IEditableCollectionViewAddNewItem", "componentmodel/ICollectionViewLiveShaping", "collections/EmptyEnumerable",
        "internal.controls/InnerItemCollectionView"], 
		function(declare, Type, IDisposable, CollectionView, 
				IEditableCollectionViewAddNewItem, ICollectionViewLiveShaping, EmptyEnumerable,
				InnerItemCollectionView){
	
    // ItemCollection rarely uses shaping directly.   Make it pay-for-play 
//    private class 
    var ShapingStorage = declare(null, {
    	
    });
    
    Object.defineProperties(ShapingStorage.prototype, {
//    	public bool    
    	_isSortingSet:       // true when user has added to this.SortDescriptions 
    	{
    		get:function(){return this.__isSortingSet;},
    		set:function(value){this.__isSortingSet = value;}
    	},
//        public bool    
    	_isGroupingSet:      // true when user has added to this.GroupDescriptions 
    	{
    		get:function(){return this.__isGroupingSet;},
    		set:function(value){this.__isGroupingSet = value;}
    	},
//        public bool    
    	_isLiveSortingSet:   // true when user has added to this.LiveSortingProperties  
    	{
    		get:function(){return this.__isLiveSortingSet;},
    		set:function(value){this.__isLiveSortingSet = value;}
    	},
//        public bool    
    	_isLiveFilteringSet: // true when user has added to this.LiveFilteringProperties 
    	{
    		get:function(){return this.__isLiveFilteringSet;},
    		set:function(value){this.__isLiveFilteringSet = value;}
    	},
//        public bool    
    	_isLiveGroupingSet:  // true when user has added to this.LiveGroupingProperties 
    	{
    		get:function(){return this.__isLiveGroupingSet;},
    		set:function(value){this.__isLiveGroupingSet = value;}
    	},

//        public SortDescriptionCollection    
    	_sort:      // storage for SortDescriptions: will forward to _collectionView.SortDescriptions when available  
    	{
    		get:function(){return this.__sort;},
    		set:function(value){this.__sort = value;}
    	},
//        public Predicate<object>            
    	_filter:    // storage for Filter when _collectionView is not available 
    	{
    		get:function(){return this.__filter;},
    		set:function(value){this.__filter = value;}
    	},
//        public ObservableCollection<GroupDescription> 
    	_groupBy: // storage for GroupDescriptions: will forward to _collectionView.GroupDescriptions when available  
    	{
    		get:function(){return this.__groupBy;},
    		set:function(value){this.__groupBy = value;}
    	},

//        public bool?    
    	_isLiveSorting:     // true if live Sorting is requested 
    	{
    		get:function(){return this.__isLiveSorting;},
    		set:function(value){this.__isLiveSorting = value;}
    	},
//        public bool?    
    	_isLiveFiltering:   // true if live Filtering is requested  
    	{
    		get:function(){return this.__isLiveFiltering;},
    		set:function(value){this.__isLiveFiltering = value;}
    	},
//        public bool?    
    	_isLiveGrouping:    // true if live Grouping is requested 
    	{
    		get:function(){return this.__isLiveGrouping;},
    		set:function(value){this.__isLiveGrouping = value;}
    	},

//        public ObservableCollection<string> 
    	_liveSortingProperties: // storage for LiveSortingProperties; will forward to _collectionView.LiveSortingProperties when available 
    	{
    		get:function(){return this.__liveSortingProperties;},
    		set:function(value){this.__liveSortingProperties = value;}
    	},
//        public ObservableCollection<string> 
    	_liveFilteringProperties: // storage for LiveFilteringProperties: will forward to _collectionView.LiveFilteringProperties when available  
    	{
    		get:function(){return this.__liveFilteringProperties;},
    		set:function(value){this.__liveFilteringProperties = value;}
    	},
//        public ObservableCollection<string> 
    	_liveGroupingProperties: // storage for LiveGroupingProperties: will forward to _collectionView.LiveGroupingProperties when available 
    	{
    		get:function(){return this.__liveGroupingProperties;},
    		set:function(value){this.__liveGroupingProperties = value;}
    	},
    });


//    private class 
    var DeferHelper = declare(IDisposable, {
    	constructor:function(/*ItemCollection*/ itemCollection) 
        {
            this._itemCollection = itemCollection; 
        },
        

//        public void 
        Dispose:function()
        { 
            if (this._itemCollection != null)
            { 
            	this._itemCollection.EndDefer(); 
            	this._itemCollection = null;
            } 
        }
    });// IDisposable
    
	var ItemCollection = declare("ItemCollection", [CollectionView, IList, 
	                                                IEditableCollectionViewAddNewItem, ICollectionViewLiveShaping],{
		"-chains-": 
		{
		      constructor: "manual"
		},
		constructor:function(/*FrameworkElement*/ modelParent, /*int*/ capacity)
        { 
//			base(EmptyEnumerable.Instance, false);
			CollectionView.prototype.constructor.call(this, EmptyEnumerable.Instance, false);
			
//	        private bool    
			this._isUsingItemsSource = false;        // true when using ItemsSource
//	        private bool    
			this._isInitializing = false;            // when true, ItemCollection does not listen to events of _collectionView
	 
//	        private int         
			this._deferLevel = 0;
			
			if(capacity === undefined){
				capacity = 16;
			}
			
			this._defaultCapacity = capacity;
			this._modelParent = modelParent; 
			
//	        private InnerItemCollectionView  _internalView;     // direct-mode list and view 
//	        private IEnumerable         _itemsSource;           // ItemsControl.ItemsSource property 
//	        private CollectionView      _collectionView;        // delegate ICollectionView
//	        private IDisposable _deferInnerRefresh; 
//	        private ShapingStorage  _shapingStorage; 
        },
        
        // These currency methods do not call OKToChangeCurrent() because 
        // ItemCollection already picks up and forwards the CurrentChanging
        // event from the inner _collectionView. 
 
        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the first item. 
        /// </summary>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToFirst:function()
        { 
            if (!this.EnsureCollectionView())
                return false; 
 
            this.VerifyRefreshNotDeferred();
 
            return this._collectionView.MoveCurrentToFirst();
        },

        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the next item.
        /// </summary> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns> 
//        public override bool 
        MoveCurrentToNext:function()
        { 
            if (!this.EnsureCollectionView())
                return false;

            this.VerifyRefreshNotDeferred(); 

            return this._collectionView.MoveCurrentToNext(); 
        }, 

        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the previous item.
        /// </summary>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToPrevious:function() 
        {
            if (!this.EnsureCollectionView()) 
                return false; 

            this.VerifyRefreshNotDeferred(); 

            return this._collectionView.MoveCurrentToPrevious();
        },
 
        /// <summary>
        /// Move <seealso cref="CurrentItem"/> to the last item. 
        /// </summary> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToLast:function() 
        {
            if (!this.EnsureCollectionView())
                return false;
 
            this.VerifyRefreshNotDeferred();
 
            return this._collectionView.MoveCurrentToLast(); 
        },
 
        /// <summary>
        /// Move <seealso cref="ICollectionView.CurrentItem"/> to the given item.
        /// </summary>
        /// <param name="item">Move CurrentItem to this item.</param> 
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentTo:function(/*object*/ item) 
        { 
            if (!this.EnsureCollectionView())
                return false; 

            this.VerifyRefreshNotDeferred();

            return this._collectionView.MoveCurrentTo(item); 
        },
 
        /// <summary> 
        /// Move <seealso cref="CurrentItem"/> to the item at the given index.
        /// </summary> 
        /// <param name="position">Move CurrentItem to this index</param>
        /// <returns>true if <seealso cref="CurrentItem"/> points to an item within the view.</returns>
//        public override bool 
        MoveCurrentToPosition:function(/*int*/ position)
        { 
            if (!this.EnsureCollectionView())
                return false; 
 
            this.VerifyRefreshNotDeferred();
 
            return this._collectionView.MoveCurrentToPosition(position);
        },
 
        /// <summary> 
        ///     Returns an enumerator object for this ItemCollection
        /// </summary>
        /// <returns>
        ///     Enumerator object for this ItemCollection 
        /// </returns>
//        protected override IEnumerator 
        GetEnumerator:function() 
        { 
            if (!this.EnsureCollectionView())
                return EmptyEnumerator.Instance; 

            return this._collectionView.GetEnumerator();
        },
 
        /// <summary>
        ///     Add an item to this collection. 
        /// </summary> 
        /// <param name="newItem">
        ///     New item to be added to collection 
        /// </param>
        /// <returns>
        ///     Zero-based index where the new item is added.  -1 if the item could not be added.
        /// </returns> 
        /// <remarks>
        ///     To facilitate initialization of direct-mode ItemsControls with Sort and/or Filter, 
        /// Add() is permitted when ItemsControl is initializing, even if a Sort or Filter has been set. 
        /// </remarks>
        /// <exception cref="InvalidOperationException"> 
        /// trying to add an item which already has a different model/logical parent
        /// - or -
        /// trying to add an item when the ItemCollection is in ItemsSource mode.
        /// </exception> 
//        public int 
        Add:function(/*object*/ newItem)
        { 
        	this.CheckIsUsingInnerView(); 
            var index = this._internalView.Add(newItem);
            this.ModelParent.SetValue(ItemsControl.HasItemsPropertyKey, true); 
            return index;
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
            // Not using CheckIsUsingInnerView() because we don't want to create internal list 

        	this.VerifyRefreshNotDeferred(); 
 
            if (this.IsUsingItemsSource)
            { 
                throw new InvalidOperationException(SR.Get(SRID.ItemsSourceInUse));
            }

            if (this._internalView != null) 
            {
            	this._internalView.Clear(); 
            } 
            this.ModelParent.ClearValue(ItemsControl.HasItemsPropertyKey);
        },

        /// <summary>
        ///     Checks to see if a given item is in this collection and in the view
        /// </summary> 
        /// <param name="containItem">
        ///     The item whose membership in this collection is to be checked. 
        /// </param> 
        /// <returns>
        ///     True if the collection contains the given item and the item passes the active filter 
        /// </returns>
//        public override bool 
        Contains:function(/*object*/ containItem)
        {
            if (!this.EnsureCollectionView()) 
                return false;
 
            this.VerifyRefreshNotDeferred(); 

            return this._collectionView.Contains(containItem); 
        },
        /// <summary>
        ///     Makes a shallow copy of object references from this 
        ///     ItemCollection to the given target array
        /// </summary> 
        /// <param name="array"> 
        ///     Target of the copy operation
        /// </param> 
        /// <param name="index">
        ///     Zero-based index at which the copy begins
        /// </param>
//        public void 
        CopyTo:function(/*Array*/ array, /*int*/ index) 
        {
            if (array == null) 
                throw new ArgumentNullException("array"); 
            if (array.Rank > 1)
                throw new ArgumentException(SR.Get(SRID.BadTargetArray), "array"); // array is multidimensional. 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index");

            // use the view instead of the collection, because it may have special sort/filter 
            if (!this.EnsureCollectionView())
                return;  // there is no collection (bind returned no collection) and therefore nothing to copy 
 
            this.VerifyRefreshNotDeferred();
 
            IndexedEnumerable.CopyTo(this._collectionView, array, index);
        },

        /// <summary> 
        ///     Finds the index in this collection/view where the given item is found.
        /// </summary> 
        /// <param name="item"> 
        ///     The item whose index in this collection/view is to be retrieved.
        /// </param> 
        /// <returns>
        ///     Zero-based index into the collection/view where the given item can be
        /// found.  Otherwise, -1
        /// </returns> 
//        public override int 
        IndexOf:function(/*object*/ item)
        { 
            if (!this.EnsureCollectionView()) 
                return -1;
 
            this.VerifyRefreshNotDeferred();

            return this._collectionView.IndexOf(item);
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
                // only check lower bound because Count could be expensive
                if (index < 0) 
                    throw new ArgumentOutOfRangeException("index");

                this.VerifyRefreshNotDeferred();
 
                if (!this.EnsureCollectionView())
                    throw new InvalidOperationException(SR.Get(SRID.ItemCollectionHasNoCollection)); 
 
                if (this._collectionView == this._internalView)
                { 
                    // check upper bound here because we know it's not expensive
                    if (index >= this._internalView.Count)
                        throw new ArgumentOutOfRangeException("index");
                } 

                return this._collectionView.GetItemAt(index); 
        }, 

        /// <summary>
        ///     Insert an item in the collection at a given index.  All items
        /// after the given position are moved down by one. 
        /// </summary>
        /// <param name="insertIndex"> 
        ///     The index at which to inser the item 
        /// </param>
        /// <param name="insertItem"> 
        ///     The item reference to be added to the collection
        /// </param>
        /// <exception cref="InvalidOperationException">
        /// Thrown when trying to add an item which already has a different model/logical parent 
        /// or when the ItemCollection is read-only because it is in ItemsSource mode
        /// </exception> 
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// Thrown if index is out of range
        /// </exception> 
//        public void 
        Insert:function(/*int*/ insertIndex, /*object*/ insertItem)
        {
        	this.CheckIsUsingInnerView();
        	this._internalView.Insert(insertIndex, insertItem); 
        	this.ModelParent.SetValue(ItemsControl.HasItemsPropertyKey, true);
        },
        /// <summary>
        ///     Removes the given item reference from the collection or view. 
        /// All remaining items move up by one.
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// the ItemCollection is read-only because it is in ItemsSource mode or there 
        /// is a sort or filter in effect
        /// </exception> 
        /// <param name="removeItem"> 
        ///     The item to be removed.
        /// </param> 
//        public void 
        Remove:function(/*object*/ removeItem)
        {
        	this.CheckIsUsingInnerView();
        	this._internalView.Remove(removeItem); 
            if (this.IsEmpty)
            { 
            	this.ModelParent.ClearValue(ItemsControl.HasItemsPropertyKey); 
            }
        },
        /// <summary>
        ///     Removes an item from the collection or view at the given index.
        /// All remaining items move up by one. 
        /// </summary>
        /// <param name="removeIndex"> 
        ///     The index at which to remove an item. 
        /// </param>
        /// <exception cref="InvalidOperationException"> 
        /// the ItemCollection is read-only because it is in ItemsSource mode
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Thrown if index is out of range 
        /// </exception>
//        public void 
        RemoveAt:function(/*int*/ removeIndex) 
        { 
        	this.CheckIsUsingInnerView();
        	this._internalView.RemoveAt(removeIndex); 
            if (this.IsEmpty)
            {
            	this.ModelParent.ClearValue(ItemsControl.HasItemsPropertyKey);
            } 
        },
        
        /// <summary> 
        /// Return true if the item is acceptable to the active filter, if any.
        /// It is commonly used during collection-changed notifications to
        /// determine if the added/removed item requires processing.
        /// </summary> 
        /// <returns>
        /// true if the item passes the filter or if no filter is set on collection view. 
        /// </returns> 
//        public override bool 
        PassesFilter:function(/*object*/ item)
        { 
            if (!this.EnsureCollectionView())
                return true;
            return this._collectionView.PassesFilter(item);
        },

        /// <summary> 
        /// Re-create the view, using any <seealso cref="SortDescriptions"/> and/or <seealso cref="Filter"/>. 
        /// </summary>
//        protected override void 
        RefreshOverride:function() 
        {
            if (this._collectionView != null)
            {
                if (this._collectionView.NeedsRefresh) 
                {
                	this._collectionView.Refresh(); 
                } 
                else
                { 
                    // if the view is up to date, we only need to raise the Reset event
                    this.OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
                }
            } 
        },
        
        /// <summary>
        /// Enter a Defer Cycle. 
        /// Defer cycles are used to coalesce changes to the ICollectionView. 
        /// </summary>
//        public override IDisposable 
        DeferRefresh:function() 
        {
            // if already deferred (level > 0) and there is a _collectionView, there should be a _deferInnerRefresh
//            Debug.Assert(_deferLevel == 0 || _collectionView == null || _deferInnerRefresh != null);
 
            // if not already deferred, there should NOT be a _deferInnerRefresh
//            Debug.Assert(_deferLevel != 0 || _deferInnerRefresh == null); 
        	
            if (this._deferLevel == 0 && this._collectionView != null)
            { 
            	this._deferInnerRefresh = this._collectionView.DeferRefresh();
            }

            ++this._deferLevel;  // do this after inner DeferRefresh, in case it throws 

            return new DeferHelper(this); 
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
        	/*IEditableCollectionView*/
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        	/*IEditableCollectionView*/
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        	/*IEditableCollectionView*/
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        /// Begins an editing transaction on the given item.  The transaction is 
        /// completed by calling either <seealso cref="IEditableCollectionView.CommitEdit"/> or 
        /// <seealso cref="IEditableCollectionView.CancelEdit"/>.  Any changes made to the item during
        /// the transaction are considered "pending", provided that the view supports 
        /// the notion of "pending changes" for the given item.
        /// </summary>
//        void    IEditableCollectionView.
        EditItem:function(/*object*/ item)
        { 
        	/*IEditableCollectionView*/
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        	/*IEditableCollectionView*/
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        	var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        	var ani = this._collectionView instanceof IEditableCollectionViewAddNewItem ? this._collectionView : null;
            if (ani != null)
            { 
                return ani.AddNewItem(newItem);
            } 
            else 
            {
                throw new InvalidOperationException(SR.Get(SRID.MemberNotAllowedForView, "AddNewItem")); 
            }
        },

        // This puts the ItemCollection into ItemsSource mode. 
//        internal void 
        SetItemsSource:function(/*IEnumerable*/ value, /*Func<object, object>*/ GetSourceItem /*= null*/)
        { 
        	if(GetSourceItem === undefined){
        		GetSourceItem = null;
        	}
            // Allow this while refresh is deferred. 

            // If we're switching from Normal mode, first make sure it's legal. 
            if (!this.IsUsingItemsSource && (this._internalView != null) && (this._internalView.RawCount > 0))
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotUseItemsSource));
            } 

            this._itemsSource = value; 
            this._isUsingItemsSource = true; 

            this.SetCollectionView(CollectionViewSource.GetDefaultCollectionView(this._itemsSource, this.ModelParent, GetSourceItem)); 
        },

        // This returns ItemCollection to direct mode.
//        internal void 
        ClearItemsSource:function() 
        {
            if (this.IsUsingItemsSource) 
            { 
                // return to normal mode
            	this._itemsSource = null; 
            	this._isUsingItemsSource = false;

            	this.SetCollectionView(this._internalView);   // it's ok if _internalView is null; just like uninitialized
            } 
            else
            { 
                // already in normal mode - no-op 
            }
        },

//        internal void 
        BeginInit:function() 
        { 
//        	Debug.Assert(_isInitializing == false);
            this._isInitializing = true; 
            if (this._collectionView != null)            // disconnect from collectionView to cut extraneous events
            	this.UnhookCollectionView(this._collectionView);
        },
 
//        internal void 
        EndInit:function()
        { 
        	this.EnsureCollectionView();
        	this._isInitializing = false;                // now we allow collectionView to be hooked up again 
            if (this._collectionView != null)
            {
            	this.HookCollectionView(this._collectionView);
            	this.Refresh();                          // apply any sort or filter for the first time 
            }
        }, 
 
//        internal override void 
        GetCollectionChangedSources:function(/*int*/ level, /*Action<int, object, bool?, List<string>>*/ format, /*List<string>*/ sources)
        { 
            format(level, this, false, sources);
            if (this._collectionView != null)
            {
            	this._collectionView.GetCollectionChangedSources(level+1, format, sources); 
            }
        },
 
        // ===== Lazy creation of InternalView =====
        // When ItemCollection is instantiated, it is uninitialized (_collectionView == null). 
        // It remains so until SetItemsSource() puts it into ItemsSource mode
        // or a modifying method call such as Add() or Insert() puts it into direct mode.

        // Several ItemCollection methods check EnsureCollectionView, which returns false if 
        // (_collectionView == null) and (InternalView == null), and it can mean two things:
        //   1) ItemCollection is uninitialized 
        //   2) ItemsControl is in ItemsSource mode, but the ItemsSource binding returned null 
        // for either of these cases, a reasonable default return value or behavior is provided.
 
        // EnsureCollectionView() will set _collectionView to the InternalView if the mode is correct.
//        bool 
        EnsureCollectionView:function()
        {
            if (this._collectionView == null && !this.IsUsingItemsSource && this._internalView != null) 
            {
                // If refresh is not necessary, fake initialization so that SetCollectionView 
                // doesn't raise a refresh event. 
                if (this._internalView.IsEmpty)
                { 
                    var wasInitializing = this._isInitializing;
                    this._isInitializing = true;
                    this.SetCollectionView(this._internalView);
                    this._isInitializing = wasInitializing; 
                }
                else 
                { 
                	this.SetCollectionView(this._internalView);
                } 

                // If we're not in Begin/End Init, now's a good time to hook up listeners
                if (!this._isInitializing)
                	this.HookCollectionView(this._collectionView); 
            }
            return (this._collectionView != null); 
        },

//        void 
        EnsureInternalView:function() 
        {
            if (this._internalView == null)
            {
                // lazy creation of the InnerItemCollectionView 
            	this._internalView = new InnerItemCollectionView(this._defaultCapacity, this);
            } 
        },

        // Change the collection view in use, unhook/hook event handlers 
//        void 
        SetCollectionView:function(/*CollectionView*/ view)
        {
            if (this._collectionView == view)
                return; 

            if (this._collectionView != null) 
            { 
                // Unhook events first, to avoid unnecessary refresh while it is still the active view.
                if (!this._isInitializing) 
                	this.UnhookCollectionView(this._collectionView);

                if (this.IsRefreshDeferred)  // we've been deferring refresh on the _collectionView
                { 
                    // end defer refresh on the _collectionView that we're letting go
                	this._deferInnerRefresh.Dispose(); 
                	this._deferInnerRefresh = null; 
                }
            } 

            var raiseReset = false;
            this._collectionView = view;
            this.InvalidateEnumerableWrapper(); 

            if (this._collectionView != null) 
            { 
            	this._deferInnerRefresh = this._collectionView.DeferRefresh();
 
                this.ApplySortFilterAndGroup();

                // delay event hook-up when initializing.  see BeginInit() and EndInit().
                if (!this._isInitializing) 
                	this.HookCollectionView(this._collectionView);
 
                if (!this.IsRefreshDeferred) 
                {
                    // make sure we get at least one refresh 
                    raiseReset = !this._collectionView.NeedsRefresh;

                    this._deferInnerRefresh.Dispose();    // This fires refresh event that should reach ItemsControl listeners
                    this._deferInnerRefresh = null; 
                }
                // when refresh is deferred, we hold on to the inner DeferRefresh until EndDefer() 
            } 
            else    // ItemsSource binding returned null
            { 
                if (!this.IsRefreshDeferred)
                {
                    raiseReset = true;
                } 
            }
 
            if (raiseReset) 
            {
                // notify listeners that the view is changed 
            	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset));
            }

            // with a new view, we have new live shaping behavior 
            this.OnPropertyChanged(new PropertyChangedEventArgs("IsLiveSorting"));
            this.OnPropertyChanged(new PropertyChangedEventArgs("IsLiveFiltering")); 
            this.OnPropertyChanged(new PropertyChangedEventArgs("IsLiveGrouping")); 
        },
 
//        void 
        ApplySortFilterAndGroup:function()
        {
            if (!this.IsShapingActive)
                return; 

            // Only apply sort/filter/group if new view supports it and ItemCollection has real values 
            if (this._collectionView.CanSort) 
            {
                // if user has added SortDescriptions to this.SortDescriptions, those settings get pushed to 
                // the newly attached collection view
                // if no SortDescriptions are set on ItemCollection,
                // the inner collection view's .SortDescriptions gets copied to this.SortDescriptions
                // when switching back to direct mode and no user-set on this.SortDescriptions 
                // then clear any .SortDescriptions set from previous inner collection view
                /*SortDescriptionCollection*/var source = (this.IsSortingSet) ? this.MySortDescriptions : this._collectionView.SortDescriptions; 
                /*SortDescriptionCollection*/var target = (this.IsSortingSet) ? this._collectionView.SortDescriptions : this.MySortDescriptions; 

//                using (SortDescriptionsMonitor.Enter()) 
//                {
                this.CloneList(target, source);
//                }
            } 

            if (this._collectionView.CanFilter && this.MyFilter != null) 
            	this._collectionView.Filter = this.MyFilter; 

            if (this._collectionView.CanGroup) 
            {
                // if user has added GroupDescriptions to this.GroupDescriptions, those settings get pushed to
                // the newly attached collection view
                // if no GroupDescriptions are set on ItemCollection, 
                // the inner collection view's .GroupDescriptions gets copied to this.GroupDescriptions
                // when switching back to direct mode and no user-set on this.GroupDescriptions 
                // then clear any .GroupDescriptions set from previous inner collection view 
                /*ObservableCollection<GroupDescription>*/var source = (this.IsGroupingSet) ? this.MyGroupDescriptions : this._collectionView.GroupDescriptions;
                /*ObservableCollection<GroupDescription>*/var target = (this.IsGroupingSet) ? this._collectionView.GroupDescriptions : this.MyGroupDescriptions; 

//                using (GroupDescriptionsMonitor.Enter())
//                {
                this.CloneList(target, source); 
//                }
            } 
 
            /*ICollectionViewLiveShaping*/var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (cvls != null) 
            {
                if (this.MyIsLiveSorting != null && cvls.CanChangeLiveSorting)
                {
                    cvls.IsLiveSorting = this.MyIsLiveSorting; 
                }
                if (this.MyIsLiveFiltering != null && cvls.CanChangeLiveFiltering) 
                { 
                    cvls.IsLiveFiltering = this.MyIsLiveFiltering;
                } 
                if (this.MyIsLiveGrouping != null && cvls.CanChangeLiveGrouping)
                {
                    cvls.IsLiveGrouping = this.MyIsLiveGrouping;
                } 
            }
        }, 
    
//        void 
        HookCollectionView:function(/*CollectionView*/ view)
        { 
//            CollectionChangedEventManager.AddHandler(view, OnViewCollectionChanged);
            view.CollectionChanged.Combine(new Delegate(this, this.OnViewCollectionChanged));
//            CurrentChangingEventManager.AddHandler(view, OnCurrentChanging);
            view.CurrentChanging.Combine(new Delegate(this, this.OnCurrentChanging));
//            CurrentChangedEventManager.AddHandler(view, OnCurrentChanged);
            view.CurrentChanged.Combine(new Delegate(this, this.OnCurrentChanged));
//            PropertyChangedEventManager.AddHandler(view, OnViewPropertyChanged, String.Empty); 
            view.PropertyChanged.Combine(new Delegate(this, this.OnViewPropertyChanged));

            /*SortDescriptionCollection*/var sort = view.SortDescriptions; 
            if (sort != null && sort != SortDescriptionCollection.Empty) 
            {
//                CollectionChangedEventManager.AddHandler(sort, OnInnerSortDescriptionsChanged); 
            	sort.CollectionChanged.Combine(new Delegate(this, this.OnInnerSortDescriptionsChanged));
            }

            /*ObservableCollection<GroupDescription>*/var group = view.GroupDescriptions;
            if (group != null) 
            {
//                CollectionChangedEventManager.AddHandler(group, OnInnerGroupDescriptionsChanged); 
                group.CollectionChanged.Combine(new Delegate(this, this.OnInnerGroupDescriptionsChanged));
            } 

            /*ICollectionViewLiveShaping*/var iclvs = view instanceof ICollectionViewLiveShaping ? view : null; 
            if (iclvs != null)
            {
                /*ObservableCollection<string>*/var liveSortingProperties = iclvs.LiveSortingProperties;
                if (liveSortingProperties != null) 
                {
//                    CollectionChangedEventManager.AddHandler(liveSortingProperties, OnInnerLiveSortingChanged); 
                    liveSortingProperties.CollectionChanged.Combine(new Delegate(this, this.OnInnerLiveSortingChanged));
                } 

                /*ObservableCollection<string>*/var liveFilteringProperties = iclvs.LiveFilteringProperties; 
                if (liveFilteringProperties != null)
                {
//                    CollectionChangedEventManager.AddHandler(liveFilteringProperties, OnInnerLiveFilteringChanged);
                	liveSortingProperties.CollectionChanged.Combine(new Delegate(this, this.OnInnerLiveFilteringChanged));
                } 

                /*ObservableCollection<string>*/var liveGroupingProperties = iclvs.LiveGroupingProperties; 
                if (liveGroupingProperties != null) 
                {
//                    CollectionChangedEventManager.AddHandler(liveGroupingProperties, OnInnerLiveGroupingChanged); 
                	liveSortingProperties.CollectionChanged.Combine(new Delegate(this, this.OnInnerLiveGroupingChanged));
                }
            }
        },
 
//        void 
        UnhookCollectionView:function(/*CollectionView*/ view)
        { 
//            CollectionChangedEventManager.RemoveHandler(view, OnViewCollectionChanged); 
            view.CollectionChanged.Remove(new Delegate(this, this.OnViewCollectionChanged));
//            CurrentChangingEventManager.RemoveHandler(view, OnCurrentChanging);
            view.CurrentChanging.Remove(new Delegate(this, this.OnCurrentChanging));
//            CurrentChangedEventManager.RemoveHandler(view, OnCurrentChanged); 
            view.CurrentChanged.Remove(new Delegate(this, this.OnCurrentChanged));
//            PropertyChangedEventManager.RemoveHandler(view, OnViewPropertyChanged, String.Empty);
            view.PropertyChanged.Remove(new Delegate(this, this.OnViewPropertyChanged));

            /*SortDescriptionCollection*/var sort = view.SortDescriptions;
            if (sort != null && sort != SortDescriptionCollection.Empty) 
            {
//                CollectionChangedEventManager.RemoveHandler(sort, OnInnerSortDescriptionsChanged); 
                sort.CollectionChanged.Remove(new Delegate(this, this.OnInnerSortDescriptionsChanged));
            } 

            /*ObservableCollection<GroupDescription>*/var group = view.GroupDescriptions; 
            if (group != null)
            {
//                CollectionChangedEventManager.RemoveHandler(group, OnInnerGroupDescriptionsChanged);
            	group.CollectionChanged.Remove(new Delegate(this, this.OnInnerGroupDescriptionsChanged));
            } 

            /*ICollectionViewLiveShaping*/var iclvs = view instanceof ICollectionViewLiveShaping ? view : null; 
            if (iclvs != null) 
            {
                /*ObservableCollection<string>*/var liveSortingProperties = iclvs.LiveSortingProperties; 
                if (liveSortingProperties != null)
                {
//                    CollectionChangedEventManager.RemoveHandler(liveSortingProperties, OnInnerLiveSortingChanged);
                	liveSortingProperties.CollectionChanged.Remove(new Delegate(this, this.OnInnerLiveSortingChanged));
                } 

                /*ObservableCollection<string>*/var liveFilteringProperties = iclvs.LiveFilteringProperties; 
                if (liveFilteringProperties != null) 
                {
//                    CollectionChangedEventManager.RemoveHandler(liveFilteringProperties, OnInnerLiveFilteringChanged); 
                	liveSortingProperties.CollectionChanged.Remove(new Delegate(this, this.OnInnerLiveFilteringChanged));
                }

                /*ObservableCollection<string>*/var liveGroupingProperties = iclvs.LiveGroupingProperties;
                if (liveGroupingProperties != null) 
                {
//                    CollectionChangedEventManager.RemoveHandler(liveGroupingProperties, OnInnerLiveGroupingChanged); 
                	liveSortingProperties.CollectionChanged.Remove(new Delegate(this, this.OnInnerLiveGroupingChanged));
                } 
            }
 
            // cancel any pending AddNew or EditItem transactions
            /*IEditableCollectionView*/
            var iev = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
            if (iev != null)
            { 
                if (iev.IsAddingNew)
                { 
                    iev.CancelNew(); 
                }
 
                if (iev.IsEditingItem)
                {
                    if (iev.CanCancelEdit)
                    { 
                        iev.CancelEdit();
                    } 
                    else 
                    {
                        iev.CommitEdit(); 
                    }
                }
            }
        }, 

//        void 
        OnViewCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        { 
            // when the collection changes, the enumerator is no longer valid.
            // This should be detected by IndexedEnumerable, but isn't because 
            // of bug 1164689.  As a partial remedy (for bug 1163708), discard the
            // enumerator here.
            //
        	this.InvalidateEnumerableWrapper(); 

            // notify listeners on ItemsControl (like ItemContainerGenerator) 
            this.OnCollectionChanged(e); 
        },
 
//        void 
        OnCurrentChanged:function(/*object*/ sender, /*EventArgs*/ e)
        {
//        	OnCurrentChanged();
        	CollectionView.prototype.OnCurrentChanged.call(this); 
        },
 
//        void 
        OnCurrentChanging:function(/*object*/ sender, /*CurrentChangingEventArgs*/ e) 
        {
//        	OnCurrentChanging(e);
            CollectionView.prototype.OnCurrentChanging.call(this, e);
        },

//        void 
        OnViewPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
        {
//        	OnPropertyChanged(e);
        	CollectionView.prototype.OnPropertyChanged.call(this, e); 
        }, 

        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary>
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        { 
            return false;   // this method is no longer used (but must remain, for compat)
        }, 
 
        // Before any modifying access, first call CheckIsUsingInnerView() because
        // a) InternalView is lazily created 
        // b) modifying access is only allowed when the InnerView is being used
        // c) modifying access is only allowed when Refresh is not deferred
//        void 
        CheckIsUsingInnerView:function()
        { 
            if (this.IsUsingItemsSource)
                throw new InvalidOperationException(SR.Get(SRID.ItemsSourceInUse)); 
            this.EnsureInternalView(); 
            this.EnsureCollectionView();
            this.VerifyRefreshNotDeferred();
        },

//        void 
        EndDefer:function() 
        {
            --this._deferLevel; 
 
            if (this._deferLevel == 0)
            { 
                if (this._deferInnerRefresh != null) 
                {
                    // set _deferInnerRefresh to null before calling Dispose, 
                    // in case Dispose throws an exception. 
                    /*IDisposable*/var deferInnerRefresh = this._deferInnerRefresh;
                    this._deferInnerRefresh = null; 
                    deferInnerRefresh.Dispose();
                }
                else
                { 
                	this.OnCollectionChanged(NotifyCollectionChangedEventArgs.BuildWithA(NotifyCollectionChangedAction.Reset));
                } 
            } 
        },
 
        // Helper to validate that we are not in the middle of a DeferRefresh
        // and throw if that is the case. The reason that this *new* version of VerifyRefreshNotDeferred
        // on ItemCollection is needed is that ItemCollection has its own *new* IsRefreshDeferred
        // which overrides IsRefreshDeferred on the base class (CollectionView), and we need to 
        // be sure that we reference that member on the derived class.
//        private new void 
        VerifyRefreshNotDeferred:function() 
        { 
            // If the Refresh is being deferred to change filtering or sorting of the
            // data by this CollectionView, then CollectionView will not reflect the correct
            // state of the underlying data.
 
            if (this.IsRefreshDeferred)
                throw new InvalidOperationException(SR.Get(SRID.NoCheckOrChangeWhenDeferred)); 
 
        },

        // SortDescription was added/removed to/from this ItemCollection.SortDescriptions, refresh CollView
//        private void 
        SortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
//            if (this.SortDescriptionsMonitor.Busy) 
//                return; 

            // if we have an inner collection view, keep its .SortDescriptions collection it up-to-date 
            if (this._collectionView != null && this._collectionView.CanSort)
            {
//                using (SortDescriptionsMonitor.Enter())
//                { 
            	this.SynchronizeCollections/*<SortDescription>*/(e, this.MySortDescriptions, this._collectionView.SortDescriptions);
//                } 
            } 

            this.IsSortingSet = true;       // most recent change came from ItemCollection 
        },

        // SortDescription was added/removed to/from inner collectionView
//        private void 
        OnInnerSortDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (!this.IsShapingActive /*|| this.SortDescriptionsMonitor.Busy*/) 
                return; 

            // keep this ItemColl.SortDescriptions in synch with inner collection view's 
//            using (SortDescriptionsMonitor.Enter())
//            {
        	this.SynchronizeCollections/*<SortDescription>*/(e, this._collectionView.SortDescriptions, this.MySortDescriptions);
//            } 

            this.IsSortingSet = false;      // most recent change came from inner collection view 
        }, 

        // GroupDescription was added/removed to/from this ItemCollection.GroupDescriptions, refresh CollView 
//        private void 
        GroupDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
//            if (this.GroupDescriptionsMonitor.Busy)
//                return; 

            // if we have an inner collection view, keep its .SortDescriptions collection it up-to-date 
            if (this._collectionView != null && this._collectionView.CanGroup) 
            {
//                using (GroupDescriptionsMonitor.Enter()) 
//                {
            	this.SynchronizeCollections/*<GroupDescription>*/(e, this.MyGroupDescriptions, this._collectionView.GroupDescriptions);
//                }
            } 

            this.IsGroupingSet = true;       // most recent change came from ItemCollection 
        },

        // GroupDescription was added/removed to/from inner collectionView 
//        private void 
        OnInnerGroupDescriptionsChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            if (!this.IsShapingActive /*|| this.GroupDescriptionsMonitor.Busy*/)
                return; 

            // keep this ItemColl.GroupDescriptions in synch with inner collection view's 
//            using (GroupDescriptionsMonitor.Enter()) 
//            {
        	this.SynchronizeCollections/*<GroupDescription>*/(e, this._collectionView.GroupDescriptions, this.MyGroupDescriptions); 
//            }

            this.IsGroupingSet = false;      // most recent change came from inner collection view
        }, 

 
        // Property was added/removed to/from this ItemCollection.LiveSortingProperties, refresh CollView 
//        private void 
        LiveSortingChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
            if (this.LiveSortingMonitor.Busy)
                return;

            // if we have an inner collection view, keep its LiveSortingProperties collection in [....] 
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null) 
            { 
//                using (LiveSortingMonitor.Enter())
//                { 
            	this.SynchronizeCollections/*<string>*/(e, this.MyLiveSortingProperties, icvls.LiveSortingProperties);
//                }
            }
 
            this.IsLiveSortingSet = true;       // most recent change came from ItemCollection
        },
 
        // Property was added/removed to/from inner collectionView's LiveSortingProperties
//        private void 
        OnInnerLiveSortingChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            if (!this.IsShapingActive || this.LiveSortingMonitor.Busy)
                return;
 
            // keep this ItemColl.LiveSortingProperties in [....] with inner collection view's
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null) 
            {
//                using (LiveSortingMonitor.Enter()) 
//                {
            	this.SynchronizeCollections/*<string>*/(e, icvls.LiveSortingProperties, this.MyLiveSortingProperties);
//                }
            } 

            this.IsLiveSortingSet = false;      // most recent change came from inner collection view 
        }, 

        // Property was added/removed to/from this ItemCollection.LiveFilteringProperties, refresh CollView
//        private void 
        LiveFilteringChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
//            if (this.LiveFilteringMonitor.Busy) 
//                return;
 
            // if we have an inner collection view, keep its LiveFilteringProperties collection in [....] 
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null) 
            {
//                using (LiveFilteringMonitor.Enter())
//                {
            	this.SynchronizeCollections/*<string>*/(e, this.MyLiveFilteringProperties, icvls.LiveFilteringProperties); 
//                }
            } 
 
            this.IsLiveFilteringSet = true;       // most recent change came from ItemCollection
        }, 

        // Property was added/removed to/from inner collectionView's LiveFilteringProperties
//        private void 
        OnInnerLiveFilteringChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
            if (!this.IsShapingActive || this.LiveFilteringMonitor.Busy)
                return; 
 
            // keep this ItemColl.LiveFilteringProperties in [....] with inner collection view's
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null)
            {
//                using (LiveFilteringMonitor.Enter())
//                { 
                this.SynchronizeCollections/*<string>*/(e, icvls.LiveFilteringProperties, this.MyLiveFilteringProperties);
//                } 
            } 

            this.IsLiveFilteringSet = false;      // most recent change came from inner collection view 
        },

        // Property was added/removed to/from this ItemCollection.LiveGroupingProperties, refresh CollView 
//        private void 
        LiveGroupingChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
//            if (LiveGroupingMonitor.Busy) 
//                return;
 
            // if we have an inner collection view, keep its LiveGroupingProperties collection in [....]
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null)
            { 
//                using (LiveGroupingMonitor.Enter())
//                { 
            	this.SynchronizeCollections/*<string>*/(e, this.MyLiveGroupingProperties, icvls.LiveGroupingProperties); 
//                }
            } 

            this.IsLiveGroupingSet = true;       // most recent change came from ItemCollection
        },
 
        // Property was added/removed to/from inner collectionView's LiveGroupingProperties
//        private void 
        OnInnerLiveGroupingChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        { 
            if (!this.IsShapingActive || this.LiveGroupingMonitor.Busy)
                return; 

            // keep this ItemColl.LiveGroupingProperties in [....] with inner collection view's
            /*ICollectionViewLiveShaping*/
            var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
            if (icvls != null) 
            {
//                using (this.LiveGroupingMonitor.Enter()) 
//                { 
            	this.SynchronizeCollections/*<string>*/(e, icvls.LiveGroupingProperties, this.MyLiveGroupingProperties);
//                } 
            }

            this.IsLiveGroupingSet = false;      // most recent change came from inner collection view
        },

 
        // keep collections in [....] 
//        private void 
        SynchronizeCollections/*<T>*/:function(/*NotifyCollectionChangedEventArgs*/ e, /*Collection<T>*/ origin, /*Collection<T>*/ clone)
        { 
            if (clone == null)
                return;             // the clone might be lazily-created

            switch (e.Action) 
            {
                case NotifyCollectionChangedAction.Add: 
//                    Debug.Assert(e.NewStartingIndex >= 0); 
                    if (clone.Count + e.NewItems.Count != origin.Count)
                    {
                    	this.CloneList(clone, origin); 
                    	break;
                    }
//                        goto case NotifyCollectionChangedAction.Reset; 
                    for (var i = 0; i < e.NewItems.Count; i++)
                    {
                        clone.Insert(e.NewStartingIndex + i, e.NewItems.Get(i));
                    } 
                    break;
                case NotifyCollectionChangedAction.Remove: 
                    if (clone.Count - e.OldItems.Count != origin.Count) 
                    {
                    	this.CloneList(clone, origin); 
                    	break;
                    }
//                        goto case NotifyCollectionChangedAction.Reset;
                    for (var i = 0; i < e.OldItems.Count; i++)
                    {
                        clone.RemoveAt(e.OldStartingIndex);
                    } 
                    break;
 
                case NotifyCollectionChangedAction.Replace: 
                    if (clone.Count != origin.Count) 
                    {
                    	this.CloneList(clone, origin); 
                    	break;
                    }
//                        goto case NotifyCollectionChangedAction.Reset;
                    for (var i = 0; i < e.OldItems.Count; i++)
                    {
                        clone.Set(e.OldStartingIndex + i, e.NewItems.Get(i)); 
                    }
                    break; 
 
                case NotifyCollectionChangedAction.Move:
                    if (clone.Count != origin.Count)
                    {
                    	this.CloneList(clone, origin); 
                    	break;
                    }
//                        goto case NotifyCollectionChangedAction.Reset;
                    if (e.NewItems.Count == 1)
                    { 
                        clone.RemoveAt(e.OldStartingIndex);
                        clone.Insert(e.NewStartingIndex, e.NewItems.Get(0)); 
                    } 
                    else
                    { 
                        for (var i = 0; i < e.OldItems.Count; i++)
                        {
                            clone.RemoveAt(e.OldStartingIndex);
                        } 
                        for (var i = 0; i < e.NewItems.Count; i++)
                        { 
                            clone.Insert(e.NewStartingIndex + i, e.NewItems.Get(i)); 
                        }
                    } 
                    break;

                // this arm also handles cases where the two collections have gotten
                // out of [....] (typically because exceptions prevented a previous [....] 
                // from happening)
                case NotifyCollectionChangedAction.Reset: 
                    this.CloneList(clone, origin); 
                    break;
 
                default:
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, e.Action));
            }
        }, 

//        private void 
        CloneList:function(/*IList*/ clone, /*IList*/ master) 
        { 
            // if either party is null, do nothing.  Allowing null lets the caller
            // avoid a lazy instantiation of the Sort/Group description collection. 
            if (clone == null || master == null)
                return;

            if (clone.Count > 0) 
            {
                clone.Clear(); 
            } 

            for (var i = 0, n = master.Count; i < n; ++i) 
            {
                clone.Add(master.Get(i));
            }
        },
        
//        private void 
        EnsureShapingStorage:function() 
        { 
            if (!this.IsShapingActive)
            { 
            	this._shapingStorage = new ShapingStorage();
            }
        },
        
        /// <summary> 
        ///     Indexer property to retrieve or replace the item at the given
        /// zero-based offset into the collection.
        /// </summary>
        /// <exception cref="InvalidOperationException"> 
        /// trying to set an item which already has a different model/logical parent; or,
        /// trying to set when in ItemsSource mode; or, 
        /// the ItemCollection is uninitialized; or, 
        /// in ItemsSource mode, the binding on ItemsSource does not provide a collection.
        /// </exception> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// Thrown if index is out of range
        /// </exception>
//        public object this[int index] 
//        {
//            get 
//            { 
//                return GetItemAt(index);
//            } 
//            set
//            {
//                CheckIsUsingInnerView();
// 
//                if (index < 0 || index >= _internalView.Count)
//                    throw new ArgumentOutOfRangeException("index"); 
// 
//                _internalView[index] = value;
//            } 
//        }
        
        Get:function(index)
        { 
            return this.GetItemAt(index);
        },
        Set:function(index, value)
        {
            this.CheckIsUsingInnerView();

            if (index < 0 || index >= this._internalView.Count)
                throw new ArgumentOutOfRangeException("index"); 

            this._internalView.Set(index, value);
        }, 
        
        
	});
	
	Object.defineProperties(ItemCollection.prototype,{

        /// <summary> 
        ///     Read-only property for the number of items stored in this collection of objects
        /// </summary>
        /// <remarks>
        ///     returns 0 if the ItemCollection is uninitialized or 
        ///     there is no collection in ItemsSource mode
        /// </remarks> 
//        public override int 
        Count: 
        {
            get:function() 
            {
                if (!this.EnsureCollectionView())
                    return 0;
 
                this.VerifyRefreshNotDeferred();
 
                return this._collectionView.Count; 
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
                if (!this.EnsureCollectionView()) 
                    return true;

                this.VerifyRefreshNotDeferred();
 
                return this._collectionView.IsEmpty;
            } 
        },

        /// <summary>
        /// The ItemCollection's underlying collection or the user provided ItemsSource collection 
        /// </summary>
//        public override IEnumerable 
        SourceCollection:
        { 
            get:function()
            { 
                if (this.IsUsingItemsSource)
                {
                    return this.ItemsSource;
                } 
                else
                { 
                	this.EnsureInternalView(); 
                    return this;
                } 
            }
        },

        /// <summary> 
        ///     Returns true if this view needs to be refreshed
        /// (i.e. when the view is not consistent with the current sort or filter). 
        /// </summary> 
        /// <returns>
        /// true when SortDescriptions or Filter is changed while refresh is deferred, 
        /// or in direct-mode, when an item have been added while SortDescriptions or Filter is in place.
        /// </returns>
//        public override bool 
        NeedsRefresh:
        { 
            get:function()
            { 
                return (this.EnsureCollectionView()) ? this._collectionView.NeedsRefresh : false; 
            }
        }, 

        /// <summary>
        /// Collection of Sort criteria to sort items in ItemCollection.
        /// </summary> 
        /// <remarks>
        /// <p> 
        /// Sorting is supported for items in the ItemsControl.Items collection; 
        /// if a collection is assigned to ItemsControl.ItemsSource, the capability to sort
        /// depends on the CollectionView for that inner collection. 
        /// Simpler implementations of CollectionVIew do not support sorting and will return an empty
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
                // always hand out this ItemCollection's SortDescription collection; 
                // in ItemsSource mode the inner collection view will be kept in synch with this collection
                if (this.MySortDescriptions == null) 
                {
                	this.MySortDescriptions = new SortDescriptionCollection();
                    if (this._collectionView != null)
                    { 
                        // no need to do this under the monitor - we haven't hooked up events yet
                    	this.CloneList(this.MySortDescriptions, this._collectionView.SortDescriptions); 
                    } 

//                    ((INotifyCollectionChanged)MySortDescriptions)
                    this.MySortDescriptions.CollectionChanged.Combine(
                    		new NotifyCollectionChangedEventHandler(this, this.SortDescriptionsChanged)); 
                }
                return this.MySortDescriptions;
            }
        },
        /// <summary>
        /// Set/get a filter callback to filter out items in collection.
        /// This property will always accept a filter, but the collection view for the
        /// underlying ItemsSource may not actually support filtering. 
        /// Please check <seealso cref="CanFilter"/>
        /// </summary> 
        /// <exception cref="NotSupportedException"> 
        /// Collections assigned to ItemsSource may not support filtering and could throw a NotSupportedException.
        /// Use <seealso cref="CanFilter"/> property to test if filtering is supported before assigning 
        /// a non-null Filter value.
        /// </exception>
//        public override Predicate<object> 
        Filter:
        { 
            get:function()
            { 
                return (this.EnsureCollectionView()) ? this._collectionView.Filter : this.MyFilter; 
            },
            set:function(value) 
            {
            	this.MyFilter = value;
                if (this._collectionView != null)
                	this._collectionView.Filter = value; 
            }
        }, 
 
        /// <summary>
        /// Test if this ICollectionView supports filtering before assigning 
        /// a filter callback to <seealso cref="Filter"/>.
        /// </summary>
//        public override bool 
        CanFilter:
        { 
            get:function()
            { 
                return (this.EnsureCollectionView()) ? this._collectionView.CanFilter : true; 
            }
        }, 

        /// <summary>
        /// Returns true if this view really supports grouping.
        /// When this returns false, the rest of the interface is ignored. 
        /// </summary>
//        public override bool 
        CanGroup: 
        { 
            get:function()
            { 
                return (this.EnsureCollectionView()) ? this._collectionView.CanGroup : false;
            }
        },
 
        /// <summary>
        /// The description of grouping, indexed by level. 
        /// </summary> 
//        public override ObservableCollection<GroupDescription> 
        GroupDescriptions:
        { 
            get:function()
            {
                // always hand out this ItemCollection's GroupDescription collection;
                // in ItemsSource mode the inner collection view will be kept in synch with this collection 
                if (this.MyGroupDescriptions == null)
                { 
                	this.MyGroupDescriptions = new ObservableCollection/*<GroupDescription>*/(); 
                    if (this._collectionView != null)
                    { 
                        // no need to do this under the monitor - we haven't hooked up events yet
                    	this.CloneList(this.MyGroupDescriptions, this._collectionView.GroupDescriptions);
                    }
 
//                    ((INotifyCollectionChanged)MyGroupDescriptions)
                    this.MyGroupDescriptions.CollectionChanged.Combine(
                    		new NotifyCollectionChangedEventHandler(this, this.GroupDescriptionsChanged));
                } 
                return this.MyGroupDescriptions; 
            }
        },
        /// <summary>
        /// The top-level groups, constructed according to the descriptions
        /// given in GroupDescriptions and/or GroupBySelector. 
        /// </summary>
//        public override ReadOnlyObservableCollection<object> 
        Groups: 
        { 
            get:function()
            { 
                return (this.EnsureCollectionView()) ? this._collectionView.Groups : null;
            }
        },

        /// <summary> 
        ///     Gets a value indicating whether the IList has a fixed size.
        ///     An ItemCollection can usually grow dynamically,
        ///     this call will commonly return FixedSize = False.
        ///     In ItemsSource mode, this call will return IsFixedSize = True. 
        /// </summary>
//        bool IList.
        IsFixedSize:
        { 
            get:function()
            { 
                return this.IsUsingItemsSource;
            }
        },
 
        /// <summary>
        ///     Gets a value indicating whether the IList is read-only. 
        ///     An ItemCollection is usually writable, 
        ///     this call will commonly return IsReadOnly = False.
        ///     In ItemsSource mode, this call will return IsReadOnly = True. 
        /// </summary>
//        bool IList.
        IsReadOnly:
        {
            get:function() 
            {
                return this.IsUsingItemsSource; 
            } 
        },
 
        /// <summary> 
        /// The ordinal position of the <seealso cref="CurrentItem"/> within the (optionally
        /// sorted and filtered) view. 
        /// </summary> 
//        public override int 
        CurrentPosition:
        { 
            get:function()
            {
                if (!this.EnsureCollectionView())
                    return -1; 

                this.VerifyRefreshNotDeferred(); 
 
                return this._collectionView.CurrentPosition;
            } 
        },

        /// <summary>
        /// Return current item. 
        /// </summary>
//        public override object 
        CurrentItem:
        { 
            get:function()
            { 
                if (!this.EnsureCollectionView())
                    return null;

                this.VerifyRefreshNotDeferred(); 

                return this._collectionView.CurrentItem; 
            } 
        },
 
        /// <summary>
        /// Return true if <seealso cref="ICollectionView.CurrentItem"/> is beyond the end (End-Of-File).
        /// </summary>
//        public override bool 
        IsCurrentAfterLast: 
        {
            get:function() 
            { 
                if (!this.EnsureCollectionView())
                    return false; 

                this.VerifyRefreshNotDeferred();

                return this._collectionView.IsCurrentAfterLast; 
            }
        },
 
        /// <summary>
        /// Return true if <seealso cref="ICollectionView.CurrentItem"/> is before the beginning (Beginning-Of-File). 
        /// </summary>
//        public override bool 
        IsCurrentBeforeFirst:
        {
            get:function() 
            {
                if (!this.EnsureCollectionView()) 
                    return false; 

                this.VerifyRefreshNotDeferred(); 

                return _collectionView.IsCurrentBeforeFirst;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
        /// <seealso cref="RemoveAt"/>.
        /// </summary> 
//        bool    IEditableCollectionView.
        CanRemove:
        { 
            get:function() 
            {
//            	IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null; 
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//              IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null; 
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
//                IEditableCollectionView
                var ecv = this._collectionView instanceof IEditableCollectionView ? this._collectionView : null;
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
//                IEditableCollectionViewAddNewItem 
                var ani = this._collectionView instanceof IEditableCollectionViewAddNewItem ? this._collectionView : null; 
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
//        public bool 
        CanChangeLiveSorting:
        {
            get:function() 
            {
            	/*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                return (cvls != null) ? cvls.CanChangeLiveSorting : false; 
            }
        }, 

        ///<summary>
        /// Gets a value that indicates whether this view supports turning live filtering on or off.
        ///</summary> 
//        public bool 
        CanChangeLiveFiltering:
        { 
            get:function() 
            {
            	/*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                return (cvls != null) ? cvls.CanChangeLiveFiltering : false;
            }
        },
 
        ///<summary>
        /// Gets a value that indicates whether this view supports turning live grouping on or off. 
        ///</summary> 
//        public bool 
        CanChangeLiveGrouping:
        { 
            get:function()
            {
            	/*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                return (cvls != null) ? cvls.CanChangeLiveGrouping : false; 
            }
        }, 
 

        ///<summary> 
        /// Gets or sets a value that indicates whether live sorting is enabled.
        /// The value may be null if the view does not know whether live sorting is enabled.
        /// Calling the setter when CanChangeLiveSorting is false will throw an
        /// InvalidOperationException. 
        ///</summary
//        public bool? 
        IsLiveSorting: 
        { 
            get:function()
            { 
            	/*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                return (cvls != null) ? cvls.IsLiveSorting : null;
            },
            set:function(value)
            {
            	this.MyIsLiveSorting = value; 
                /*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                if (cvls != null && cvls.CanChangeLiveSorting)
                    cvls.IsLiveSorting = value; 
            }
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
            get:function()
            { 
            	/*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                return (cvls != null) ? cvls.IsLiveFiltering : null; 
            },
            set:function(value)
            { 
                this.MyIsLiveFiltering = value;
                /*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                if (cvls != null && cvls.CanChangeLiveFiltering)
                    cvls.IsLiveFiltering = value; 
            }
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
            get:function() 
            {
                /*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                return (cvls != null) ? cvls.IsLiveGrouping : null;
            },
            set:function(value)
            { 
            	this.MyIsLiveGrouping = value;
                /*ICollectionViewLiveShaping*/
            	var cvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                if (cvls != null && cvls.CanChangeLiveGrouping) 
                    cvls.IsLiveGrouping = value;
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
//        public ObservableCollection<string> 
        LiveSortingProperties:
        {
            get:function()
            { 
                // always hand out this ItemCollection's LiveSortingProperties collection;
                // in ItemsSource mode the inner collection view will be kept in synch with this collection 
                if (this.MyLiveSortingProperties == null) 
                {
                	this.MyLiveSortingProperties = new ObservableCollection/*<string>*/(); 
                    /*ICollectionViewLiveShaping*/
                	var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                    if (icvls != null)
                    {
                        // no need to do this under the monitor - we haven't hooked up events yet 
                        this.CloneList(this.MyLiveSortingProperties, icvls.LiveSortingProperties);
                    } 
 
//                    ((INotifyCollectionChanged)MyLiveSortingProperties)
                    this.MyLiveSortingProperties.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.LiveSortingChanged));
                } 
                return this.MyLiveSortingProperties;
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
//        public ObservableCollection<string> 
        LiveFilteringProperties: 
        {
            get:function() 
            {
                // always hand out this ItemCollection's LiveFilteringProperties collection;
                // in ItemsSource mode the inner collection view will be kept in synch with this collection
                if (this.MyLiveFilteringProperties == null) 
                {
                    this.MyLiveFilteringProperties = new ObservableCollection/*<string>*/(); 
                    /*ICollectionViewLiveShaping*/
                    var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null; 
                    if (icvls != null)
                    { 
                        // no need to do this under the monitor - we haven't hooked up events yet
                        this.CloneList(this.MyLiveFilteringProperties, icvls.LiveFilteringProperties);
                    }
 
                    /*((INotifyCollectionChanged)MyLiveFilteringProperties)*/
                    this.MyLiveFilteringProperties.CollectionChanged.Comnine(new NotifyCollectionChangedEventHandler(this, this.LiveFilteringChanged));
                } 
                return this.MyLiveFilteringProperties; 
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
//        public ObservableCollection<string> 
        LiveGroupingProperties:
        { 
            get:function()
            {
                // always hand out this ItemCollection's LiveGroupingProperties collection;
                // in ItemsSource mode the inner collection view will be kept in synch with this collection 
                if (this.MyLiveGroupingProperties == null)
                { 
                	this.MyLiveGroupingProperties = new ObservableCollection/*<string>*/(); 
                    /*ICollectionViewLiveShaping*/
                	var icvls = this._collectionView instanceof ICollectionViewLiveShaping ? this._collectionView : null;
                    if (icvls != null) 
                    {
                        // no need to do this under the monitor - we haven't hooked up events yet
                        this.CloneList(this.MyLiveGroupingProperties, icvls.LiveGroupingProperties);
                    } 

                    /*((INotifyCollectionChanged)MyLiveGroupingProperties)*/
                    this.MyLiveGroupingProperties.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.LiveGroupingChanged)); 
                } 
                return this.MyLiveGroupingProperties;
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
                /*IItemProperties*/
            	var iip = this._collectionView instanceof IItemProperties ? this._collectionView : null;
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


//        internal DependencyObject 
        ModelParent:
        { 
            get:function() { return this._modelParent; }
        }, 
 
//        internal FrameworkElement 
        ModelParentFE:
        { 
            get:function() { return this.ModelParent instanceof FrameworkElement ? this.ModelParent : null; }
        },
        
        // Read-only property used by ItemsControl
//        internal IEnumerable 
        ItemsSource:
        { 
            get:function()
            { 
                return this._itemsSource; 
            }
        }, 

//        internal bool 
        IsUsingItemsSource:
        {
            get:function() 
            {
                return this._isUsingItemsSource; 
            } 
        },
 
//        internal CollectionView 
        CollectionView:
        {
            get:function() { return this._collectionView; }
        },
 
//        internal IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
            	this.EnsureInternalView();
                return this._internalView.LogicalChildren; 
            }
        }, 

//        private new bool 
        IsRefreshDeferred:
        {
            get:function() { return this._deferLevel > 0; }
        }, 
 
//        private bool 
        IsShapingActive:
        {
            get:function() { return this._shapingStorage != null; }
        }, 

//        private SortDescriptionCollection 
        MySortDescriptions: 
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._sort : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._sort = value; } 
        },

//        private bool 
        IsSortingSet:
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._isSortingSet : false; },
            set:function(value) 
            { 
                this._shapingStorage._isSortingSet = value; 
            }
        },

//        private MonitorWrapper 
//        SortDescriptionsMonitor: 
//        {
//            get:function() 
//            { 
//                if (this._shapingStorage._sortDescriptionsMonitor == null)
//                	this._shapingStorage._sortDescriptionsMonitor = new MonitorWrapper(); 
//                return this._shapingStorage._sortDescriptionsMonitor;
//            }
//        },
 

//        private Predicate<object> 
        MyFilter: 
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._filter : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._filter = value; } 
        },


//        private ObservableCollection<GroupDescription> 
        MyGroupDescriptions: 
        {
            get:function() { return this.IsShapingActive ? this._shapingStorage._groupBy : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._groupBy = value; } 
        },
 
//        private bool 
        IsGroupingSet:
        {
            get:function() { return this.IsShapingActive ? this._shapingStorage._isGroupingSet : false; },
            set:function(value) 
            {
                if (this.IsShapingActive) 
                	this._shapingStorage._isGroupingSet = value; 
                else
                    Debug.Assert(!value, "Shaping storage not available"); 
            }
        },

//        private MonitorWrapper 
//        GroupDescriptionsMonitor: 
//        {
//            get:function() 
//            { 
//                if (this._shapingStorage._groupDescriptionsMonitor == null)
//                	this._shapingStorage._groupDescriptionsMonitor = new MonitorWrapper(); 
//                return _shapingStorage._groupDescriptionsMonitor;
//            }
//        },
 

//        private bool? 
        MyIsLiveSorting: 
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveSorting : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._isLiveSorting = value; } 
        },

//        private ObservableCollection<string> 
        MyLiveSortingProperties:
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._liveSortingProperties : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._liveSortingProperties = value; } 
        }, 

//        private bool 
        IsLiveSortingSet: 
        {
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveSortingSet : false; },
            set:function(value)
            { 
            	this._shapingStorage._isLiveSortingSet = value; 
            } 
        },
 
////        private MonitorWrapper 
//        LiveSortingMonitor:
//        {
//            get:function()
//            { 
//                if (this._shapingStorage._liveSortingMonitor == null)
//                	this._shapingStorage._liveSortingMonitor = new MonitorWrapper(); 
//                return this._shapingStorage._liveSortingMonitor; 
//            }
//        }, 


//        private bool? 
        MyIsLiveFiltering:
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveFiltering : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._isLiveFiltering = value; } 
        }, 

//        private ObservableCollection<string> 
        MyLiveFilteringProperties:
        {
            get:function() { return this.IsShapingActive ? this._shapingStorage._liveFilteringProperties : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._liveFilteringProperties = value; }
        }, 

//        private bool 
        IsLiveFilteringSet: 
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveFilteringSet : false; },
            set:function(value) 
            {
            	this._shapingStorage._isLiveFilteringSet = value;
            } 
        },
 
////        private MonitorWrapper 
//        LiveFilteringMonitor: 
//        {
//            get:function() 
//            {
//                if (this._shapingStorage._liveFilteringMonitor == null)
//                	this._shapingStorage._liveFilteringMonitor = new MonitorWrapper();
//                return this._shapingStorage._liveFilteringMonitor; 
//            }
//        }, 
 

//        private bool? 
        MyIsLiveGrouping: 
        {
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveGrouping : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._isLiveGrouping = value; }
        }, 

//        private ObservableCollection<string> 
        MyLiveGroupingProperties: 
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._liveGroupingProperties : null; },
            set:function(value) { this.EnsureShapingStorage(); this._shapingStorage._liveGroupingProperties = value; } 
        },

//        private bool 
        IsLiveGroupingSet:
        { 
            get:function() { return this.IsShapingActive ? this._shapingStorage._isLiveGroupingSet : false; },
            set:function(value)
            { 
                this._shapingStorage._isLiveGroupingSet = value; 
            }
        },

////        private MonitorWrapper 
//        LiveGroupingMonitor:
//        {
//            get:function()
//            { 
//                if (this._shapingStorage._liveGroupingMonitor == null)
//                	this._shapingStorage._liveGroupingMonitor = new MonitorWrapper(); 
//                return this._shapingStorage._liveGroupingMonitor;
//            }
//        }
        
	});
	
	ItemCollection.Type = new Type("ItemCollection", ItemCollection, 
			[CollectionView.Type, IList.Type, IEditableCollectionViewAddNewItem.Type, ICollectionViewLiveShaping.Type
			 /*,IItemProperties.Type, IWeakEventListener.Type*/ ]);
	return ItemCollection;
});
